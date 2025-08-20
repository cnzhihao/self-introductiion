#!/usr/bin/env python3
"""
Simple HTTP Server for AI产品专家个人简历网站
适用于macOS系统的本地开发服务器

使用方法:
    python server.py [port]
    
默认端口: 8000
访问地址: http://localhost:8000
"""

import http.server
import socketserver
import sys
import os
import webbrowser
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        """添加自定义响应头"""
        # 启用CORS（跨域资源共享）
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # 缓存控制
        if self.path.endswith(('.html', '.css', '.js')):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        
        super().end_headers()
    
    def do_GET(self):
        """处理GET请求"""
        # 如果访问根路径，重定向到index.html
        if self.path == '/':
            self.path = '/index.html'
        
        # 检查文件是否存在
        file_path = Path(self.path.lstrip('/'))
        if not file_path.exists() and self.path != '/index.html':
            # 如果文件不存在，返回404页面
            self.send_error(404, f"File not found: {self.path}")
            return
        
        super().do_GET()
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        timestamp = self.log_date_time_string()
        client_ip = self.client_address[0]
        message = format % args
        
        # 彩色输出（如果终端支持）
        if hasattr(sys.stdout, 'isatty') and sys.stdout.isatty():
            if '200' in message:
                color = '\033[92m'  # 绿色
            elif '404' in message:
                color = '\033[91m'  # 红色
            else:
                color = '\033[93m'  # 黄色
            reset = '\033[0m'
            print(f"{color}[{timestamp}] {client_ip} - {message}{reset}")
        else:
            print(f"[{timestamp}] {client_ip} - {message}")

def check_files():
    """检查必要的文件是否存在"""
    required_files = ['index.html', 'styles.css', 'script.js']
    missing_files = []
    
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ 缺少必要文件: {', '.join(missing_files)}")
        print("请确保所有文件都在当前目录中")
        return False
    
    print("✅ 所有必要文件都存在")
    return True

def get_local_ip():
    """获取本机IP地址"""
    import socket
    try:
        # 创建一个UDP连接来获取本机IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
        return local_ip
    except Exception:
        return "127.0.0.1"

def print_banner(port, local_ip):
    """打印启动横幅"""
    banner = f"""
    🤖 AI产品专家个人简历网站服务器
    ═══════════════════════════════════════
    
    ✅ 服务器已启动
    📂 工作目录: {os.getcwd()}
    🌐 本地访问: http://localhost:{port}
    🌍 网络访问: http://{local_ip}:{port}
    
    💡 提示:
    • 按 Ctrl+C 停止服务器
    • 修改文件后刷新浏览器即可看到更改
    • 适用于本地开发和测试
    
    ═══════════════════════════════════════
    """
    print(banner)

def main():
    """主函数"""
    # 检查必要文件
    if not check_files():
        sys.exit(1)
    
    # 解析命令行参数
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
            if port < 1 or port > 65535:
                raise ValueError("端口号必须在1-65535之间")
        except ValueError as e:
            print(f"❌ 无效的端口号: {e}")
            sys.exit(1)
    
    # 获取本机IP
    local_ip = get_local_ip()
    
    try:
        # 创建服务器
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            # 打印启动信息
            print_banner(port, local_ip)
            
            # 自动打开浏览器
            try:
                webbrowser.open(f'http://localhost:{port}')
                print("🚀 浏览器已自动打开")
            except Exception:
                print("💡 请手动在浏览器中打开上述链接")
            
            print("\n📡 服务器日志:")
            print("-" * 50)
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 服务器已停止")
        print("感谢使用AI产品专家个人简历网站！")
        
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ 端口 {port} 已被占用")
            print(f"💡 请尝试使用其他端口: python server.py {port + 1}")
        else:
            print(f"❌ 服务器启动失败: {e}")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ 意外错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()